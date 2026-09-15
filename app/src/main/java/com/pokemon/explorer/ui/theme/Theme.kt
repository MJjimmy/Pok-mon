package com.pokemon.explorer.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp

// ------------------------------------------------------------------ palette

/** Poké Ball red — the primary brand colour. */
val PokeRed = Color(0xFFEE1515)

/** Electric yellow — the energy/accent colour (Random Discovery, caught state). */
val PokeYellow = Color(0xFFFFCB05)

/** Deep navy the app is painted on: a "Pokédex at night", not inverted grey. */
val AppBackground = Color(0xFF0D1020)

/** Water/steel blue used for the Compare accent. */
val CompareBlue = Color(0xFF6390F0)

// Surfaces are translucent white over [AppBackground], which keeps the dark theme
// feeling layered instead of flat. Names carry the alpha so call sites read clearly.
val Surface04 = Color.White.copy(alpha = 0.04f)
val Surface05 = Color.White.copy(alpha = 0.05f)
val Surface06 = Color.White.copy(alpha = 0.06f)
val Surface07 = Color.White.copy(alpha = 0.07f)
val Surface08 = Color.White.copy(alpha = 0.08f)
val Surface10 = Color.White.copy(alpha = 0.10f)
val Border08 = Color.White.copy(alpha = 0.08f)
val Border10 = Color.White.copy(alpha = 0.10f)
val Border12 = Color.White.copy(alpha = 0.12f)

// Text tints, mirroring the Tailwind `text-white/40` style scale used on the web.
val TextHigh = Color.White
val TextMedium = Color.White.copy(alpha = 0.55f)
val TextLow = Color.White.copy(alpha = 0.40f)
val TextFaint = Color.White.copy(alpha = 0.30f)

/** 8dp grid, per the design system. */
object Spacing {
    val xs = 4.dp
    val sm = 8.dp
    val md = 12.dp
    val lg = 16.dp
    val xl = 20.dp
    val xxl = 24.dp
}

/** Corner radii: soft for UI chrome, tighter for chips and badges. */
object Radii {
    val chip = RoundedCornerShape(percent = 50)
    val badge = RoundedCornerShape(percent = 50)
    val input = RoundedCornerShape(12.dp)
    val button = RoundedCornerShape(14.dp)
    val card = RoundedCornerShape(16.dp)
    val panel = RoundedCornerShape(24.dp)
    val hero = RoundedCornerShape(28.dp)
}

// ------------------------------------------------------------------- fonts

/**
 * The web app used Nunito (display), Outfit (body) and JetBrains Mono (numbers).
 * Those are Google Fonts, so they can't be fetched at build time here — these
 * families stand in as platform equivalents.
 *
 * To match the original exactly, drop the three TTFs into
 * `app/src/main/res/font/` and swap these for
 * `FontFamily(Font(R.font.nunito_bold, FontWeight.Bold), ...)`.
 */
val DisplayFont = FontFamily.SansSerif
val BodyFont = FontFamily.SansSerif
val MonoFont = FontFamily.Monospace

// ------------------------------------------------------------------- theme

private val AppColorScheme = darkColorScheme(
    primary = PokeRed,
    onPrimary = Color.White,
    secondary = PokeYellow,
    onSecondary = Color(0xFF1A1200),
    background = AppBackground,
    onBackground = Color.White,
    surface = AppBackground,
    onSurface = Color.White,
    surfaceVariant = Surface08,
    onSurfaceVariant = TextMedium,
    outline = Border12,
)

/**
 * App-wide theme.
 *
 * The design brief specifies a single dark "Pokédex at night" look, so only a dark
 * colour scheme is defined. The Settings screen stores a System/Light/Dark
 * preference, but light mode has no design yet — see the README.
 */
@Composable
fun PokemonExplorerTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = AppColorScheme,
        typography = Typography(),
        content = content,
    )
}

/**
 * The soft type-coloured wash behind hero panels and cards: a diagonal gradient
 * from the primary type colour into the secondary, fading into the page background.
 */
fun typeGradient(
    primary: Color,
    secondary: Color = primary,
    startAlpha: Float = 0.33f,
    endAlpha: Float = 0.19f,
    fadeTo: Color = Color(0xFF1A1030),
): Brush = Brush.linearGradient(
    listOf(
        primary.copy(alpha = startAlpha),
        secondary.copy(alpha = endAlpha),
        fadeTo,
    ),
)
